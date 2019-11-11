import React, { Component } from 'react';
import logo from '../../images/indaba-logo-dark.png';
import './Home.css';
import { getEvents } from "../../services/events";
import { cameraService } from '../../services/cameraStream'
import { NavLink } from "react-router-dom";
import { Card, Button } from "react-bootstrap"

const headings = ["Event", "Start date", "End date", "Status"];
const fieldNames = ["description", "start_date", "end_date", "status"];

class Home extends Component {


  constructor(props) {
    super(props);

    this.state = {
      headings: headings,
      rows: []
    }
  }

  componentDidMount() {
    getEvents().then(response => {
      if (response) {
        this.setState({
          headings: headings,
          rows: response
        })
      }
    });
  }

  render() {
    let table = (<div></div>)

    if (this.state.rows && this.state.rows.length > 0) {
      const theadMarkup = (
        <tr>
          {this.state.headings.map((_cell, cellIndex) => {
            return (
              <th className="Cell">
                {this.state.headings[cellIndex]}
              </th>
            )
          })}
        </tr>
      );

      const tbodyMarkup = this.state.rows.map((_row, rowIndex) => {
        return (
          <tr>
            {fieldNames.map((_cell, cellIndex) => {
              return (
                <td className="Cell">
                  {
                    this.state.rows[rowIndex][fieldNames[cellIndex]] === "Apply now" ||
                      this.state.rows[rowIndex][fieldNames[cellIndex]] === "Continue application" ?
                      <NavLink to="/applicationForm">{this.state.rows[rowIndex][fieldNames[cellIndex]]}</NavLink> :
                      this.state.rows[rowIndex][fieldNames[cellIndex]]
                  }
                </td>
              )
            })}
          </tr>
        )
      });

      table = this.state.rows ? (
        <table align="center" className="Table">
          <thead>{theadMarkup}</thead>
          <tbody>{tbodyMarkup}</tbody>
        </table>
      ) : (<div></div>)
    }

    return (
      <div >
        <div>
          <img src={logo} className="img-fluid" alt="logo" />
        </div>
        <h2 className="Blurb">Welcome to Lytehouse</h2>
        {this.props.user &&
          <div class="row">
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{this.props.user.camera1Name}</Card.Title>
                <Card.Text>
                  IP Address: {this.props.user.camera1Ip}
                </Card.Text>
                <Button variant="primary" onClick={cameraService.openInNewTab(this.props.user.camera1Ip, this.props.user.camera1Name)} >View This Stream</Button>
              </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{this.props.user.camera2Name}</Card.Title>
                <Card.Text>
                  IP Address: {this.props.user.camera2Ip}
                </Card.Text>
                <Button variant="primary" onClick={cameraService.openInNewTab(this.props.user.camera2Ip, this.props.user.camera2Name)}>View This Stream</Button>
              </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{this.props.user.camera3Name}</Card.Title>
                <Card.Text>
                  IP Address: {this.props.user.camera3Ip}
                </Card.Text>
                <Button variant="primary" onClick={cameraService.openInNewTab(this.props.user.camera3Ip, this.props.user.camera3Name)}>View This Stream</Button>
              </Card.Body>
            </Card>
          </div>
        }
        {!this.props.user &&
          <p class="text-center"><NavLink to="/createAccount">Sign up</NavLink> for an account in order to add computer vision to your cameras, or <NavLink to="/login">login</NavLink> to watch the machine learning at work on your feeds.</p>}
        {this.props.user && table}
      </div>
    );
  }
}

export default Home;

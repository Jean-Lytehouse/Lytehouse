import React, { Component } from 'react';
import logo from '../../images/indaba-logo-dark.png';
import './Home.css';
import { getEvents } from "../../services/events";
import { NavLink } from "react-router-dom";

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
        <h2 className="Blurb">Welcome to Baobab</h2>
        {!this.props.user && 
          <p class="text-center"><NavLink to="/createAccount">Sign up</NavLink> for an account in order to apply for an Indaba event, or <NavLink to="/login">login</NavLink> if you already have one.</p>}
        {this.props.user && table}
      </div>
    );
  }
}

export default Home;

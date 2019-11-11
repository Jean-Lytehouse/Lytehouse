import React, { Component } from "react";
import { userService } from "../../../services/user";
import { withRouter } from "react-router";
import FormTextBox from "../../../components/form/FormTextBox";
import validationFields from "../../../utils/validation/validationFields";
import { run, ruleRunner } from "../../../utils/validation/ruleRunner";
import {
  requiredText,
  validEmail
} from "../../../utils/validation/rules.js";
import { createColClassName } from "../../../utils/styling/styling";

const fieldValidations = [
  ruleRunner(validationFields.firstName, requiredText),
  ruleRunner(validationFields.lastName, requiredText),
  // ruleRunner(validationFields.phoneNumber, requiredText),
  ruleRunner(validationFields.email, validEmail),
  ruleRunner(validationFields.password, requiredText),
  ruleRunner(validationFields.confirmPassword, requiredText),
  ruleRunner(validationFields.camera1Ip, requiredText),
  ruleRunner(validationFields.camera1Name, requiredText),
  ruleRunner(validationFields.camera1Ip, requiredText),
  ruleRunner(validationFields.camera2Name, requiredText),
  ruleRunner(validationFields.camera2Ip, requiredText),
  ruleRunner(validationFields.camera3Name, requiredText),
  ruleRunner(validationFields.camera3Ip, requiredText),
];

class CreateAccountForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: "",
        // phoneNumber: "",
        password: "",
        confirmPassword: "",
        camera1Ip: "",
        camera1Name: "",
        camera2Ip: "",
        camera2Name: "",
        camera3Ip: "",
        camera3Name: "",
      },
      showErrors: false,
      submitted: false,
      loading: false,
      errors: [],
      error: "",
      created: false
    };
  }

  getContentValue(options, value) {
    if (options && options.filter) {
      return options.filter(option => {
        return option.value === value;
      });
    } else return null;
  }

  checkOptionsList(optionsList) {
    if (Array.isArray(optionsList)) {
      return optionsList;
    } else return [];
  }

  componentWillMount() {
  }

  validateForm() {
    return (
      this.state.user.email.length > 0 &&
      // this.state.user.phoneNumber.length > 0 &&
      this.state.user.password.length > 0 &&
      this.state.user.confirmPassword.length > 0 &&
      this.state.user.camera1Ip.length > 0 &&
      this.state.user.camera1Name.length > 0 &&
      this.state.user.camera2Ip.length > 0 &&
      this.state.user.camera2Name.length > 0 &&
      this.state.user.camera3Ip.length > 0 &&
      this.state.user.camera3Name.length > 0 
    );
  }

  handleChangeDropdown = (name, dropdown) => {
    this.setState(
      {
        user: {
          ...this.state.user,
          [name]: dropdown.value
        }
      },
      function () {
        let errorsForm = run(this.state.user, fieldValidations);
        this.setState({ errors: { $set: errorsForm } });
      }
    );
  };

  handleChange = field => {
    return event => {
      this.setState(
        {
          user: {
            ...this.state.user,
            [field.name]: event.target.value
          }
        },
        function () {
          let errorsForm = run(this.state.user, fieldValidations);
          this.setState({ errors: { $set: errorsForm } });
        }
      );
    };
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ submitted: true, showErrors: true });

    if (this.state.user.password != this.state.user.confirmPassword) {
      this.state.errors.$set.push({ passwords: "Passwords do not match" });
    }
    if (this.state.errors.$set.length > 0) return;

    this.setState({ loading: true });

    userService.create(this.state.user).then(
      user => {
        this.setState({
          loading: false,
          created: true
        });
      },
      error =>
        this.setState({
          error:
            error.response && error.response.data
              ? error.response.data.message
              : error.message,
          loading: false
        })
    );
  };

  getErrorMessages = errors => {
    let errorMessages = [];
    if (errors.$set === null) return;

    let arr = errors.$set;
    for (let i = 0; i < arr.length; i++) {
      errorMessages.push(
        <div className={"alert alert-danger"}>{Object.values(arr[i])}</div>
      );
    }
    return errorMessages;
  };
  render() {
    const xs = 12;
    const sm = 6;
    const md = 6;
    const lg = 6;
    const commonColClassName = createColClassName(xs, sm, md, lg);
    const colClassNameSurname = createColClassName(12, 3, 4, 4);
    const colClassEmailLanguageDob = createColClassName(12, 4, 4, 4);
    const {
      firstName,
      lastName,
      email,
      camera1Ip,
      camera1Name,
      camera2Ip,
      camera2Name,
      camera3Ip,
      camera3Name,
      // phoneNumber,
      password,
      confirmPassword,
    } = this.state.user;

    const { loading, errors, showErrors, error, created } = this.state;

    if (created) {
      return (
        <div className="CreateAccount">
          <p className="h5 text-center mb-4">Create Account</p>
          <p className="account-created">
            Your Lytehouse account has been created, but before you can use it, we
            need to verify your email address. Please check your email (and spam
            folder) for a message containing a link to verify your email
            address.
          </p>
        </div>
      );
    }

    return (
      <div className="CreateAccount">
        <form onSubmit={this.handleSubmit}>
          <p className="h5 text-center mb-4">Create Account</p>
          <div class="row">
            <div class={colClassNameSurname}>
              <FormTextBox
                id={validationFields.firstName.name}
                type="text"
                placeholder={validationFields.firstName.display}
                onChange={this.handleChange(validationFields.firstName)}
                value={firstName}
                label={validationFields.firstName.display}
              />
            </div>
            <div class={colClassNameSurname}>
              <FormTextBox
                id={validationFields.lastName.name}
                type="text"
                placeholder={validationFields.lastName.display}
                onChange={this.handleChange(validationFields.lastName)}
                value={lastName}
                label={validationFields.lastName.display}
              />
            </div>
          </div>
          <div class="row">
            <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.email.name}
                type="email"
                placeholder={validationFields.email.display}
                onChange={this.handleChange(validationFields.email)}
                value={email}
                label={validationFields.email.display}
              />
            </div>
            {/* <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.phoneNumber.name}
                type="text"
                placeholder={validationFields.phoneNumber.display}
                onChange={this.handleChange(validationFields.phoneNumber)}
                value={phoneNumber}
                label={validationFields.phoneNumber.display}
              />
            </div> */}
          </div>
          <div class="row">
            <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.camera1Ip.name}
                type="text"
                placeholder={validationFields.camera1Ip.display}
                onChange={this.handleChange(validationFields.camera1Ip)}
                value={camera1Ip}
                label={validationFields.camera1Ip.display}
              />
            </div>
            <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.camera1Name.name}
                type="text"
                placeholder={validationFields.camera1Name.display}
                onChange={this.handleChange(validationFields.camera1Name)}
                value={camera1Name}
                label={validationFields.camera1Name.display}
              />
            </div>
          </div>
          <div class="row">
            <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.camera2Ip.name}
                type="text"
                placeholder={validationFields.camera2Ip.display}
                onChange={this.handleChange(validationFields.camera2Ip)}
                value={camera2Ip}
                label={validationFields.camera2Ip.display}
              />
            </div>
            <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.camera2Name.name}
                type="text"
                placeholder={validationFields.camera2Name.display}
                onChange={this.handleChange(validationFields.camera2Name)}
                value={camera2Name}
                label={validationFields.camera2Name.display}
              />
            </div>
          </div>
          <div class="row">
            <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.camera3Ip.name}
                type="text"
                placeholder={validationFields.camera3Ip.display}
                onChange={this.handleChange(validationFields.camera3Ip)}
                value={camera3Ip}
                label={validationFields.camera3Ip.display}
              />
            </div>
            <div class={colClassEmailLanguageDob}>
              <FormTextBox
                id={validationFields.camera3Name.name}
                type="text"
                placeholder={validationFields.camera3Name.display}
                onChange={this.handleChange(validationFields.camera3Name)}
                value={camera3Name}
                label={validationFields.camera3Name.display}
              />
            </div>
          </div>
          <div class="row">
          </div>
          <div class="row">
            <div class={commonColClassName}>
              <FormTextBox
                id={validationFields.password.name}
                type="password"
                placeholder={validationFields.password.display}
                onChange={this.handleChange(validationFields.password)}
                value={password}
                label={validationFields.password.display}
              />
            </div>
            <div class={commonColClassName}>
              <FormTextBox
                id={validationFields.confirmPassword.name}
                type="password"
                placeholder={validationFields.confirmPassword.display}
                onChange={this.handleChange(validationFields.confirmPassword)}
                value={confirmPassword}
                label={validationFields.confirmPassword.display}
              />
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            disabled={!this.validateForm() || loading}
          >
            {loading && (
              <span
                class="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              />
            )}
            Sign Up
          </button>
          {errors && errors.$set && showErrors && this.getErrorMessages(errors)}
          {error && <div class="alert alert-danger">{error}</div>}
        </form>
      </div>
    );
  }
}

export default withRouter(CreateAccountForm);

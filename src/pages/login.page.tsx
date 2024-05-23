import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router";
import i18n from "../i18n";

import Password from "../components/ui/password.component";
import { login } from "../redux/actions/login.actions";
import "../scss/page/login-page/_login.scss";

import logo from "../assets/svg/logo-haxa-ceram.png";

interface ILoginProps {
  isLoading: boolean;
  errorMessage: string;
  redirectPath: string;
}

interface ILoginDispatchProps {
  login: typeof login;
}

interface ILoginStateProps {
  passwordInput: string;
  username: string;
  redirect: boolean;
}

class LoginPage extends React.Component<
  ILoginProps & ILoginDispatchProps,
  ILoginStateProps
> {
  constructor(porps: any) {
    super(porps);
    this.state = {
      passwordInput: "",
      username: "",
      redirect: false,
    };
  }

  componentDidUpdate(prevProps: ILoginProps, prevState: ILoginStateProps) {
    if (
      prevProps.isLoading !== this.props.isLoading &&
      !this.props.isLoading &&
      this.props.errorMessage === ""
    ) {
      this.setState({
        redirect: true,
      });
    }
  }

  setPassword = (password: string) => {
    this.setState({ passwordInput: password });
  };

  handleOnSubmit = (event: any) => {
    event.preventDefault();
    this.loginAction();
  };

  loginAction = () => {
    this.props.login(this.state.username, this.state.passwordInput);
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.props.redirectPath} />;
    }

    return (
      <div className="login__container">
        <img alt="" src={logo} className="login__icon" />
        <Card className="login__card">
          <Card.Body className="login__body">
            <Card.Title className="login__header">{i18n.t("LOGIN")}</Card.Title>
            <Form onSubmit={this.handleOnSubmit}>
              <Form.Group
                controlId="loginUsername"
                className="login__margin-username"
              >
                <Form.Control
                  type="text"
                  placeholder={i18n.t("USERNAME")}
                  className="login__textbox"
                  onChange={(e) => {
                    this.setState({
                      username: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Password
                id="loginPassword"
                className="login__textbox"
                labelText=""
                placeholder={i18n.t("PASSWORD")}
                setPasswordText={this.setPassword}
                passwordText={this.state.passwordInput}
              ></Password>

              <div className="error-text text-center login__error-text">
                {this.props.errorMessage}
              </div>
              <Button
                variant="primary"
                className="login__button"
                type="submit"
                block
                disabled={this.props.isLoading}
              >
                {this.props.isLoading ? i18n.t("LOADING") : i18n.t("LOGIN")}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.Login?.isLoading,
    errorMessage: state.Login?.errorMessage,
    redirectPath: state.Login.redirectPath,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      login,
    },
    dispatch
  ),
  dispatch,
});

export default connect<ILoginProps, ILoginDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);

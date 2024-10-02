import { useState } from 'react';
import {Link, Redirect} from 'react-router-dom';
import Layout from '../Layout';
import { showError, showLoading } from '../../utils/messages';
import { login } from '../../api/apiAuth';
import { authenticate, isAuthenticated, userInfo } from '../../utils/auth';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: false,
        loading: false,
        disabled: false,
        redirect: false
    });

    const { email, password, loading, error, redirect, disabled } = values;


    const handleChange = e => {
        setValues({
            ...values,
            error: false,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({ ...values, error: false, loading: true, disabled: true });

        login({ email, password })
            .then(response => {
                authenticate(response.data.token, () => {
                    setValues({
                        email: '',
                        password: '',
                        success: true,
                        disabled: false,
                        loading: false,
                        redirect: true
                    })
                })
            })
            .catch(err => {
                let errMsg = 'Something went wrong!';
                if (err.response) {
                    errMsg = err.response.data;
                } else {
                    errMsg = 'Something went wrong!';
                }
                setValues({ ...values, error: errMsg, disabled: false, loading: false })
            })
    }


    const signInForm = () => (
        <section className="bg-light py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <div className="card border border-light-subtle rounded-3 shadow-sm">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">Login</h2>   
                                <form onSubmit={handleSubmit}>
                                    <div className="row gy-2 overflow-hidden">
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    id="email"
                                                    placeholder="name@example.com"
                                                    value={email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-grid my-3">
                                                <button disabled={disabled} className="btn btn-primary btn-lg"
                                                        type="submit">Log in
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="m-0 d-flex align-items-center text-secondary text-center">
                                                <span>Dont have an account?</span>
                                                <Link className="nav-link" to="/register">Register</Link>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
)
    ;

    const redirectUser = () => {
        if (redirect) return <Redirect to={`${userInfo().role}/dashboard`}/>
        if (isAuthenticated()) return <Redirect to="/"/>
    }
    return (
        <Layout title="Login" className="container col-md-8 offset-md-2">
            {redirectUser()}
            {showLoading(loading)}
            {showError(error, error)}
            <h3>Login Here,</h3>
            <hr/>
            {signInForm()}
            <hr/>
        </Layout>
    );
}

export default Login;
import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from '../Layout';
import { showError, showLoading } from '../../utils/messages';
import { register } from '../../api/apiAuth';
import { isAuthenticated } from '../../utils/auth';

const Register = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        loading: false,
        disabled: false,
        success: false
    });

    const { name, email, password, success, error, loading, disabled } = values;

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

        register({ name, email, password })
            .then(response => {
                setValues({
                    name: '',
                    email: '',
                    password: '',
                    success: true,
                    disabled: false,
                    loading: false
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

    const signUpForm = () => (
        <section className="bg-light py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <div className="card border border-light-subtle rounded-3 shadow-sm">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">Enter your details to
                                    register</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="row gy-2 overflow-hidden">
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <label htmlFor="name" className="form-label">Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Name"
                                                    value={name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
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
                                                <button disabled={disabled} className="btn btn-primary btn-lg" type="submit">Sign up
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="m-0 d-flex align-items-center text-secondary text-center">
                                                <span>Already have an account?</span>
                                                <Link className="nav-link" to="/login">Login</Link>
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
);

    const showSuccess = () => {
        if (success) return (
            <div className="alert alert-primary">
                New Account Created. Please <Link to="/login">Login</Link>.
            </div>
        )
    }

    return (
        <Layout title="Register" className="container col-md-8 offset-md-2">
            {isAuthenticated() ? <Redirect to="/"/> : ""}
            {showSuccess()}
            {showLoading(loading)}
            {showError(error, error)}
            <h3>Register Here,</h3>
            <hr/>
            {signUpForm()}
            <hr/>
        </Layout>
    );
}

export default Register;
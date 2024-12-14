import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="home-container">
      <Header />
      <div className="text-con">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="descriptions">
          Millions of people are searching for jobs, salary information company
          reviews. Find the jobs that fits your abilites and potential.
        </p>
        <Link className="link" to="/jobs">
          <button type="button" className="find-jobs-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Home

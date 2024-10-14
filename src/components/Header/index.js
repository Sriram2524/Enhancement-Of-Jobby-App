import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header-con">
      <li className="header-link">
        <Link className="link" to="/">
          <img
            className="header-logo-img"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </Link>
      </li>
      <ul className="unordered-list">
        <li className="list">
          <Link className="home-link" to="/">
            Home
          </Link>
        </li>
        <li className="list">
          <Link className="home-link" to="/jobs">
            Jobs
          </Link>
        </li>
      </ul>
      <button onClick={onClickLogout} type="button" className="logout-button">
        Logout
      </button>
    </nav>
  )
}
export default withRouter(Header)

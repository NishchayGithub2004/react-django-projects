import React from 'react' // import React from react library
import { Link } from 'react-router-dom' // import Link from react-router-dom library to create links

// create a functional component called 'Wrapper' that takes in 'token', 'handleLogout', and 'children' as props
const Wrapper = ({ token, handleLogout, children }) => {
  // create a function called 'logout' that calls the 'handleLogout' function
  const logout = () => {
    handleLogout()
  }

  return (
    <div>
      {/* if 'token' is a valid prop, that means user is logged in and can logout, so logout button is rendered, otherwise render link to login page as user is yet to login */}
      {token ? (
        <button onClick={logout}>Logout</button>
      ) :
        <Link to="/login">
          <button>Login</button>
        </Link>
      }
      <main>{children}</main> {/* render contents 'children' prop */}
    </div>
  )
}

export default Wrapper;
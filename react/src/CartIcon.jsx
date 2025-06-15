import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import React from "react";

export default function CartIcon({ to }) {
  return (
    <Link to={to}>
      <FontAwesomeIcon
        data-testid="cart-icon"
        icon={faCartShopping}
        className="cart"
        id="cart"
      />
    </Link>
  );
}

CartIcon.propTypes = {
  to: PropTypes.string.isRequired,
};
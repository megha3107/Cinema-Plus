import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const requireAuth = (ChildComponnent) => () => {
  let isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return <ChildComponnent />;
};

export default requireAuth;

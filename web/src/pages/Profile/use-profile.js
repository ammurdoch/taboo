import { useSelector, shallowEqual } from 'react-redux';

export default function useProfile() {
  const profile = useSelector((store) => store.profile, shallowEqual);

  return profile;
}

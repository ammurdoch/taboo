import { gql, useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { updateProfileAction } from '../../redux-store/auth-store';

export const updateProfileMutation = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      uid
      name
      email
      phoneNumber
      birthday
      profilePic {
        id
        filename
        desc
        original {
          s3Key
          size
          filename
          contentType
        }
        sm {
          s3Key
          size
          filename
          contentType
        }
        md {
          s3Key
          size
          filename
          contentType
        }
        lg {
          s3Key
          size
          filename
          contentType
        }
        tags
        permissions
        createdBy
        updatedBy
        createdAt
        updatedAt
      }
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

function useUpdateProfile(uid) {
  const [updateProfile] = useMutation(updateProfileMutation);
  const dispatch = useDispatch();
  return async (values) => {
    const result = await updateProfile({
      variables: {
        profile: {
          uid,
          ...values,
        },
      },
    });
    dispatch(updateProfileAction(result.data.updateProfile));
    return result;
  };
}

export default useUpdateProfile;

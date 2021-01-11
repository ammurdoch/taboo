import { gql } from '@apollo/client';
import apolloClient from '../apollo-client';

const profileQuery = gql`
  query Profile {
    profile {
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

export default async function fetchProfile() {
  const result = await apolloClient.query({
    query: profileQuery,
    fetchPolicy: 'network-only',
  });
  return result && result.data && result.data.profile;
}

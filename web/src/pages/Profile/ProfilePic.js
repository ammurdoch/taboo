import React, { useCallback, useRef, useState } from 'react';
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Button, Upload, Progress, message } from 'antd';
import { generateUuid } from '../../shared/utils';
import firebase from 'firebase/app';
import { useMutation, gql } from '@apollo/client';
import useUpdateProfile from './use-update-profile';
import { useDispatch } from 'react-redux';
import { updateProfileAction } from '../../redux-store/auth-store';

export const createImageMutation = gql`
  mutation CreateImage($image: ImageCreate!) {
    createImage(image: $image) {
      id
      filename
      desc
      original {
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
  }
`;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function ProfilePic({ profile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(false);
  const [createImageRecord] = useMutation(createImageMutation);
  const updateProfile = useUpdateProfile(profile.uid);
  const dispatch = useDispatch();

  const doUpload = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
          throw new Error('Invalid file type, must be .jpg or .png');
        }
        const parts = file.name.split('.');
        const extension = parts[parts.length - 1].toLowerCase();
        const uuid = generateUuid();
        const storageRef = firebase.storage().ref();
        const s3Key = `images/${uuid}.${extension}`;
        const uploadTask = storageRef.child(s3Key).put(file);
        setLoading(true);
        uploadTask.on(
          'state_changed',
          function (snapshot) {
            const _progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(_progress.toFixed(0));
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          },
          function (err) {
            setError(err.message);
            reject();
          },
          async function () {
            try {
              const result = await createImageRecord({
                variables: {
                  image: {
                    id: uuid,
                    filename: file.name,
                    desc: `${profile.uid}'s profile picture`,
                    original: {
                      s3Key,
                      size: file.size,
                      filename: file.name,
                      contentType: file.type,
                    },
                    tags: ['profile'],
                    permissions: ['anyone-can-read'],
                  },
                },
              });
              await updateProfile({
                profilePicId: uuid,
              });
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  console.log('File available at', downloadURL);
                });
              setProgress(100);
              getBase64(file, (src) => {
                dispatch(
                  updateProfileAction({
                    profilePicUrl: src,
                  }),
                );
                setLoading(false);
                message.success('Profile picture successfully saved');
                resolve();
              });
            } catch (err) {
              console.error(err);
              setError('There was an error uploading your picture');
            }
          },
        );
      }),
    [createImageRecord, profile, updateProfile, dispatch],
  );

  const onChange = useCallback(
    async (values) => {
      console.log('onChange', values);
      await doUpload(values.file);
    },
    [doUpload],
  );
  const onBefore = useCallback((obj) => {
    console.log('onBefore', obj);
    return false;
  }, []);
  return (
    <>
      <div className="profile-img-container">
        <div className="profile-img">
          {loading && <Progress type="circle" percent={progress} />}
          {!loading && !(profile && profile.profilePicUrl) && (
            <UserOutlined style={{ fontSize: 100 }} />
          )}
          {!loading && profile && profile.profilePicUrl && (
            <div
              className="profile-img-img"
              style={{ backgroundImage: `url("${profile.profilePicUrl}")` }}
              alt="Profile Pic"
            />
          )}
        </div>
        <div>
          <Upload
            name="profilePic"
            className="profile-pic-upload"
            showUploadList={false}
            beforeUpload={onBefore}
            onChange={onChange}
          >
            <Button
              disabled={loading}
              icon={loading ? <LoadingOutlined /> : <PlusOutlined />}
            >
              {loading ? 'Saving ...' : 'Upload'}
            </Button>
          </Upload>
        </div>
        {error && (
          <div className="ant-form-item-has-error" style={{ marginTop: 16 }}>
            <div className="ant-form-item-explain">{error}</div>
          </div>
        )}
      </div>
      <style jsx>{`
        .profile-img-container {
          width: 100%;
          text-align: center;
          padding: 16px;
          border-bottom: 1px solid #eeeeee;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .profile-img {
          width: 156px;
          height: 156px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          border-radius: 200px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .profile-img-img {
          height: 100%;
          width: 100%;
          background-position: center;
          background-size: cover;
        }
      `}</style>
    </>
  );
}

export default ProfilePic;

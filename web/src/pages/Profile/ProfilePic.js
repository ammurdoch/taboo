import React, { useCallback, useRef, useState } from 'react';
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Button, Upload, Progress } from 'antd';
import { generateUuid } from '../../shared/utils';
import firebase from 'firebase/app';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function ProfilePic({ profile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(false);
  const fileInputRef = useRef();
  const [uploadedImage, setUplaodedImage] = useState(null);

  const doUpload = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        if (!['image/png', 'image/jpg'].includes(file.type)) {
          throw new Error('Invalid file type, must be .jpg or .png');
        }
        const parts = file.name.split('.');
        const extension = parts[parts.length - 1].toLowerCase();
        const uuid = generateUuid();
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef
          .child(`images/${uuid}.${extension}`)
          .put(file);
        setLoading(true);
        uploadTask.on(
          'state_changed',
          function (snapshot) {
            const _progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(_progress);
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
          function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                console.log('File available at', downloadURL);
              });
            setProgress(100);
            setTimeout(() => {
              getBase64(file, (src) => {
                setLoading(false);
                setUplaodedImage(src);
                resolve();
              });
            }, 1000);
          },
        );
      }),
    [],
  );

  const onChoose = useCallback(() => {
    console.log('choose');
    fileInputRef.current.click();
  }, []);
  const onChange = useCallback(async (values) => {
    console.log('onChange', values);
    await doUpload(values.file);
  }, []);
  const onBefore = useCallback((obj) => {
    console.log('onBefore', obj);
    return false;
  }, []);
  return (
    <>
      <div className="profile-img-container">
        <div className="profile-img">
          {loading && <Progress type="circle" percent={progress} />}
          {!loading && !uploadedImage && (
            <UserOutlined style={{ fontSize: 100 }} />
          )}
          {!loading && uploadedImage && (
            <div
              className="profile-img-img"
              style={{ backgroundImage: `url("${uploadedImage}")` }}
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
            <Button icon={loading ? <LoadingOutlined /> : <PlusOutlined />}>
              Upload
            </Button>
          </Upload>
        </div>
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

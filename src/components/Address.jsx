import React from 'react';

const AddressComponent = () => {
  const [address, setAddress] = React.useState({ detail: '' });

  const updateDetail = (newDetail) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      detail: newDetail,
    }));
  };

  return (
    <div>
      <p>Address Detail: {address.detail}</p>
      <button onClick={() => updateDetail('123')}>Update Address Detail to 123</button>
      <button onClick={() => updateDetail('456')}>Update Address Detail to 456</button>
    </div>
  );
};

export default AddressComponent;
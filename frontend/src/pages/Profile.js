import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col, Table, Modal } from 'react-bootstrap';
import { getUserProfile, updateUsername, updatePhoneNumber, addAddress, updateAddress, deleteAddress } from '../services/userService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      setUsername(data.username);
      setPhoneNumber(data.phoneNumber || '');
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    
    if (!username) {
      return setError('Username is required');
    }
    
    try {
      setError('');
      setSuccess('');
      setUpdating(true);
      
      await updateUsername(username);
      
      setSuccess('Username updated successfully');
      fetchUserProfile();
    } catch (err) {
      setError('Failed to update username');
    } finally {
      setUpdating(false);
    }
  };

  const handlePhoneUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      setUpdating(true);
      
      await updatePhoneNumber(phoneNumber);
      
      setSuccess('Phone number updated successfully');
      fetchUserProfile();
    } catch (err) {
      setError('Failed to update phone number');
    } finally {
      setUpdating(false);
    }
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditAddressId(address._id);
      setStreet(address.street);
      setCity(address.city);
      setState(address.state);
      setZipCode(address.zipCode);
      setIsPrimary(address.isPrimary);
    } else {
      setEditAddressId(null);
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setIsPrimary(false);
    }
    
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      setUpdating(true);
      
      const addressData = {
        street,
        city,
        state,
        zipCode,
        isPrimary
      };
      
      if (editAddressId) {
        await updateAddress(editAddressId, addressData);
      } else {
        await addAddress(addressData);
      }
      
      setSuccess('Address saved successfully');
      setShowAddressModal(false);
      fetchUserProfile();
    } catch (err) {
      setError('Failed to save address');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      await deleteAddress(addressId);
      
      setSuccess('Address deleted successfully');
      fetchUserProfile();
    } catch (err) {
      setError('Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="mb-4">User Profile</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Update Username</Card.Title>
              <Form onSubmit={handleUsernameUpdate}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={updating}
                >
                  {updating ? <Spinner animation="border" size="sm" /> : 'Update Username'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Update Phone Number</Card.Title>
              <Form onSubmit={handlePhoneUpdate}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={updating}
                >
                  {updating ? <Spinner animation="border" size="sm" /> : 'Update Phone'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Addresses</Card.Title>
            <Button variant="success" size="sm" onClick={() => openAddressModal()}>
              Add New Address
            </Button>
          </div>
          
          {profile.addresses.length > 0 ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Street</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zip Code</th>
                  <th>Primary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profile.addresses.map((address) => (
                  <tr key={address._id}>
                    <td>{address.street}</td>
                    <td>{address.city}</td>
                    <td>{address.state}</td>
                    <td>{address.zipCode}</td>
                    <td>{address.isPrimary ? 'Yes' : 'No'}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => openAddressModal(address)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center my-3">No addresses added yet</p>
          )}
        </Card.Body>
      </Card>
      
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editAddressId ? 'Edit Address' : 'Add New Address'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddressSubmit}>
            <Form.Group className="mb-3" controlId="formStreet">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formZip">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formPrimary">
              <Form.Check
                type="checkbox"
                label="Set as primary address"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowAddressModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={updating}>
                {updating ? <Spinner animation="border" size="sm" /> : 'Save Address'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;


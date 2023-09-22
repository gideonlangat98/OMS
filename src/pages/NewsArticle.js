import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Alert, Form, Table } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

const NewsArticle = ({ deleteArticle, company_articles, setCompany_Articles, handleUpdateArticle, updateArticle }) => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { backendUrl } = useContext(OmsContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedArticle, setEditedArticle] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to control the display of the add form

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    content: '',
  });

  const handleClose = () => {
    setShow(false);
    setFormData({
      title: '',
      date: '',
      content: '',
    });
  };

  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    axios
      .post(`${backendUrl}/company_articles`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        if (response.status === 201) {
          const updatedArticle = response.data
          handleUpdateArticle(updatedArticle);
          setShowAlert(true);
          handleClose();

          setShowAddForm(false);
        } else {
          throw new Error(`Network response was not ok. Response status: ${response.status}`);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (article) => {
    setEditedArticle(article);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (editedArticle) {
      const token = localStorage.getItem('token');

      axios
        .put(`${backendUrl}/company_articles/${editedArticle.id}`, editedArticle, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(function (response) {
          if (response.status === 201) {
            const updatedArticles = company_articles.map((article) =>
              article.id === editedArticle.id ? editedArticle : article
            );
            setCompany_Articles(updatedArticles);

            setShowEditModal(false);
            setEditedArticle(null);
          } else {
            throw new Error(`Network response was not ok. Response status: ${response.status}`);
          }
        })
        .catch(function (error) {
          console.error('Error updating article:', error);
        });
    }
  };

  const handleDelete = (articleId) => {
    deleteArticle(articleId)
      .then(() => {
        const updatedArticles = company_articles.filter(
          (article) => article.id !== articleId
        );
        setCompany_Articles(updatedArticles);
      })
      .catch((error) => {
        console.error('Error deleting article:', error);
      });
  };
  
  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddClose = () => {
    setShowAddForm(false);
  };

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pb-8 pt-3">
      <div className="news-articles">
      <div className=" mt-5 mb-2 text-center text-gred" style={{ color: 'green' }}>
            <h3 className='text-center'>
              <b>Company News</b>
            </h3>
          </div>
        <div className="row">
          <div className="mt-5 mb-4">
            <Button variant="primary" onClick={handleAddClick} className='float-right'>
              Add News Article
            </Button>
          </div>
        </div>
        {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
            News article added successfully!
          </Alert>
        )}

        <div className="model_box">
         <div className="table w-full h-full">
         <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Article</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editedArticle && (
                <Form>
                  <Form.Group controlId="editTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedArticle.title}
                      onChange={(e) =>
                        setEditedArticle({ ...editedArticle, title: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="editDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editedArticle.date}
                      onChange={(e) =>
                        setEditedArticle({ ...editedArticle, date: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="editContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editedArticle.content}
                      onChange={(e) =>
                        setEditedArticle({ ...editedArticle, content: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleEditSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
         </div>
        </div>

        {showAddForm && (
          <div className="model_box">
            <div className="table w-full h-full">
            <Modal show={showAddForm} onHide={handleAddClose} backdrop="static" keyboard={false} centered>
              <Modal.Header closeButton>
                <Modal.Title>Add News Article</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Enter Title</Form.Label>
                    <Form.Control
                      type="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formDate">
                    <Form.Label>Please Enter Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formDateTo">
                    <Form.Label>Please Enter Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <button type="submit" className="btn btn-success mt-4">
                    Post News
                  </button>
                </form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleAddClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            </div>
          </div>
        )}

        <ArticleTable
          company_articles={company_articles}
          deleteArticle={handleDelete}
          handleEdit={handleEdit}
        />
      </div>
    </div>
  );
};

const ArticleTable = ({ company_articles, deleteArticle, handleEdit }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Content</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {company_articles.map((company_article) => (
          <tr key={company_article.id}>
            <td>{company_article.title}</td>
            <td>{company_article.date}</td>
            <td>{company_article.content}</td>
            <td>
              <div className='m-2'>
                <Button className='mr-2' variant="primary" onClick={() => handleEdit(company_article)}>
                 Edit
                </Button>
                <Button variant="danger" onClick={() => deleteArticle(company_article.id)}>
                 Delete
                </Button>
              </div>
              
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default NewsArticle;

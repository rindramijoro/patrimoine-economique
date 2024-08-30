import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function TablePossession() {
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/possessions');
        if (Array.isArray(response.data)) {
          setPossessions(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setPossessions([]);
        }
      } catch (error) {
        console.error('There was an error fetching the possessions!', error);
        setPossessions([]);
      }
    };

    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    try {
      await axios.put(`http://localhost:3000/possession/${libelle}/close`);
      setPossessions(prevPossessions =>
        prevPossessions.map(possession =>
          possession.libelle === libelle
            ? { ...possession, Fin: new Date().toISOString().split('T')[0] }
            : possession
        )
      );
    } catch (error) {
      console.error('Error closing possession:', error);
    }
  };

  const handleDelete = async (libelle) => {
    try {
      await axios.delete(`http://localhost:3000/possession/${libelle}`);
      setPossessions(prevPossessions =>
        prevPossessions.filter(possession => possession.libelle !== libelle)
      );
    } catch (error) {
      console.error('Error deleting possession:', error);
    }
  };
  
  return (
    <div className="d-flex flex-column justify-content-evenly m-5">
      <Table responsive="xl" className="w-100 table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Libelle</th>
            <th className="text-center">Valeur</th>
            <th className="text-center">Debut</th>
            <th className="text-center">Fin</th>
            <th className="text-center">Amortissement</th>
            <th className="text-center">Valeur Actuelle</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession) => (
            <tr key={possession.libelle}>
              <td className="text-center">{possessions.indexOf(possession) + 1}</td>
              <td className="text-center">{possession.libelle}</td>
              <td className="text-center">{possession.valeur} Ariary</td>
              <td className="text-center">{possession.Debut.split('T')[0]}</td>
              <td className="text-center">{possession.Fin ? possession.Fin.split('T')[0] : '-'}</td>
              <td className="text-center">{possession.Amortissement} %</td>
              <td className="text-center">{possession.valeurActuelle || '-'}</td>
              <td className="text-center">
                <Link to={`/possession/${possession.libelle}/update`} className="btn btn-warning btn-sm">
                  Edit
                </Link>
                <Button
                  variant="dark"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleClose(possession.libelle)}
                >
                  Close
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleDelete(possession.libelle)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className='align-items-center'>
        <Link to="/possession/create" className="btn btn-primary mb-3">
          Create Possession
        </Link>
      </div>
    </div>
  );
}

export default TablePossession;

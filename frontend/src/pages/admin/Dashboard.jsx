import { useState, useEffect } from 'react';
import { Card, Alert, Spinner } from 'react-bootstrap';
import DashboardNav from '../../components/common/DashboardNav';
import CaseCard from '../../components/cases/CaseCard';
import { API_ENDPOINTS } from '../../constants';
import AuthService from '../../services/auth';

function AdminDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CASES, {
          headers: {
            'Authorization': `Bearer ${AuthService.getAccessToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cases');
        }

        const data = await response.json();
        setCases(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <DashboardNav userRole="Admin" />
      <div className="py-4" style={{ marginTop: '80px' }}>
        <div style={{ margin: '0 20px' }}>
          <Card className="shadow-sm">
            <Card.Body className="px-4">
              <h4 className="mb-4 ps-2 fs-3">All Cases</h4>
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : cases.length === 0 ? (
                <Alert variant="info">No cases found.</Alert>
              ) : (
                <div>
                  {cases.map(caseItem => (
                    <CaseCard 
                      key={caseItem.id}
                      caseData={caseItem}
                    />
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 
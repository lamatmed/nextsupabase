import ProjectsClient from './ProjectsClient';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsClient />
    </ProtectedRoute>
  );
}

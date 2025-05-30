import React from 'react';
import type { User } from '../types/user.type';
import type { ColumnDefinition } from '@/features/table/types/table.types';
import { ReusableTable } from '@/features/table/ReusableTable';
import { userService } from '../services/usersService';
const UsersTable: React.FC = () => {
  const columns: ColumnDefinition<User>[] = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      width: '80px',
    },
    {
      key: 'name',
      title: 'Nom',
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      key: 'role',
      title: 'Rôle',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'Utilisateur', value: 'user' },
        { label: 'Modérateur', value: 'moderator' },
      ],
      render: (value: string) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'admin'
              ? 'bg-red-100 text-red-800'
              : value === 'moderator'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {value === 'admin' ? 'Admin' : value === 'moderator' ? 'Modérateur' : 'Utilisateur'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Statut',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
      ],
      render: (value: string) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date de création',
      sortable: true,
      filterable: true,
      filterType: 'date',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    },
    {
      key: 'lastLoginAt',
      title: 'Dernière connexion',
      sortable: true,
      render: (value?: string) =>
        value ? new Date(value).toLocaleDateString('fr-FR') : '-',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="mt-2 text-gray-600">
          Liste des utilisateurs avec filtres, recherche et pagination
        </p>
      </div>

      <ReusableTable
        columns={columns}
        queryKey={['users']}
        fetchFn={userService.getUsers}
        searchable={true}
        defaultPageSize={10}
        className="bg-white"
      />
    </div>
  );
};

export default UsersTable;
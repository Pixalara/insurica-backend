'use client'

import { Client } from './types'

const STORAGE_KEY = 'insurica_clients'

const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        name: 'Amit Sharma',
        email: 'amit.sharma@example.com',
        phone: '+91 98765 43210',
        created_at: new Date('2024-01-15').toISOString(),
        registrationStatus: 'Registered',
        policyStatus: 'Active',
        productType: 'Health Insurance',
        insurer: 'HDFC Life',
        city: 'Mumbai',
        state: 'Maharashtra'
    },
    {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.p@example.com',
        phone: '+91 98989 89898',
        created_at: new Date('2024-01-20').toISOString(),
        registrationStatus: 'Registered',
        policyStatus: 'Active',
        productType: 'Motor Insurance',
        insurer: 'ICICI Lombard',
        city: 'Ahmedabad',
        state: 'Gujarat'
    },
    {
        id: '3',
        name: 'Rahul Verma',
        email: 'rahul.v@example.com',
        phone: '+91 99887 76655',
        created_at: new Date('2024-01-10').toISOString(),
        registrationStatus: 'Not Registered',
        policyStatus: 'Inactive',
        productType: 'Life Insurance',
        insurer: 'LIC',
        city: 'Delhi',
        state: 'Delhi'
    },
    {
        id: '4',
        name: 'Sneha Gupta',
        email: 'sneha.g@example.com',
        phone: '+91 91234 56789',
        created_at: new Date('2024-01-25').toISOString(),
        registrationStatus: 'Registered',
        policyStatus: 'Active',
        productType: 'Travel Insurance',
        insurer: 'Tata AIA',
        city: 'Bangalore',
        state: 'Karnataka'
    },
    {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram.s@example.com',
        phone: '+91 98765 12345',
        created_at: new Date('2024-01-05').toISOString(),
        registrationStatus: 'Registered',
        policyStatus: 'Expired',
        productType: 'Term Plan',
        insurer: 'Max Life',
        city: 'Jaipur',
        state: 'Rajasthan'
    }
]

export const ClientStorage = {
    getClients: (): Client[] => {
        if (typeof window === 'undefined') return []
        
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CLIENTS))
            return MOCK_CLIENTS
        }
        
        try {
            return JSON.parse(stored)
        } catch (e) {
            console.error('Failed to parse clients from storage', e)
            return []
        }
    },

    addClient: (client: Omit<Client, 'id' | 'created_at'>): Client => {
        const clients = ClientStorage.getClients()
        const newClient = {
            ...client,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
        } as Client
        
        const updatedClients = [newClient, ...clients]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients))
        return newClient
    },

    updateClient: (id: string, updates: Partial<Client>): Client | null => {
        const clients = ClientStorage.getClients()
        const index = clients.findIndex(c => c.id === id)
        
        if (index === -1) return null
        
        const updatedClient = { ...clients[index], ...updates }
        clients[index] = updatedClient
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
        return updatedClient
    },

    deleteClient: (id: string): void => {
        const clients = ClientStorage.getClients()
        const filtered = clients.filter(c => c.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    }
}

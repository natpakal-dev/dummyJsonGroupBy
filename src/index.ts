import axios from 'axios';

const API_URL = 'https://dummyjson.com/users';

interface User {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    hair: { color: string };
    company: { department: string };
    address: { postalCode: string };
}

interface TransformedData {
    [department: string]: {
        male: number;
        female: number;
        ageRange: string;
        hair: Record<string, number>;
        addressUser: Record<string, string>;
    };
}

const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

const transformData = (users: User[]): TransformedData => {
    const groupedData: TransformedData = {};

    users.forEach(({ firstName, lastName, gender, hair, company, address }) => {
        const department = company.department;
        if (!groupedData[department]) {
            groupedData[department] = { male: 0, female: 0, ageRange: '', hair: {}, addressUser: {} };
        }

        if (gender === 'male' || gender === 'female') {
            groupedData[department][gender]++;
        }

        groupedData[department].hair[hair.color] = (groupedData[department].hair[hair.color] || 0) + 1;
        groupedData[department].addressUser[`${firstName}${lastName}`] = address.postalCode;
    });

    for (const dept in groupedData) {
        const ages = users.filter(u => u.company.department === dept).map(u => u.age);
        groupedData[dept].ageRange = `${Math.min(...ages)}-${Math.max(...ages)}`;
    }

    return groupedData;
};

export { fetchUsers, transformData };

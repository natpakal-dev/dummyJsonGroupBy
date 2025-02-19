import { fetchUsers, transformData } from './index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('fetchUsers()', () => {
    it('should fetch users successfully', async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                users: [
                    {
                        firstName: 'John',
                        lastName: 'Doe',
                        gender: 'male',
                        age: 30,
                        hair: { color: 'brown' },
                        company: { department: 'Engineering' },
                        address: { postalCode: '12345' },
                    }
                ]
            }
        });

        const users = await fetchUsers();
        expect(users[0].firstName).toBe('John');
    });

    it('should return empty array if request fails', async () => {
        mockedAxios.get.mockRejectedValue(new Error('API Error'));
        const users = await fetchUsers();
        expect(users).toEqual([]);
    });
});

describe('transformData()', () => {
    it('should transform user data correctly', () => {
        const users = [
            {
                firstName: 'John',
                lastName: 'Doe',
                gender: 'male',
                age: 30,
                hair: { color: 'brown' },
                company: { department: 'Engineering' },
                address: { postalCode: '12345' },
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                gender: 'female',
                age: 25,
                hair: { color: 'black' },
                company: { department: 'Engineering' },
                address: { postalCode: '67890' },
            }
        ];

        const transformed = transformData(users);

        expect(transformed).toHaveProperty('Engineering');
        expect(transformed.Engineering.male).toBe(1);
        expect(transformed.Engineering.female).toBe(1);
        expect(transformed.Engineering.hair.brown).toBe(1);
        expect(transformed.Engineering.hair.black).toBe(1);
        expect(transformed.Engineering.addressUser['JohnDoe']).toBe('12345');
        expect(transformed.Engineering.addressUser['JaneSmith']).toBe('67890');
        expect(transformed.Engineering.ageRange).toBe('25-30');
    });
});

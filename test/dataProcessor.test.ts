import { getTransformedData, User } from '../src/dataProcessor';

describe('dataProcessor', () => {
  it('should process data and group by department', async () => {
    const mockResponse: { users: User[] } = {
      users: [
        {
          company: {
            department: 'Engineering',
          },
          gender: 'male',
          age: 28,
          hair: {
            color: 'Black',
          },
          firstName: 'John',
          lastName: 'Doe',
          address: {
            postalCode: '12345',
          }
        },
        {
          company: {
            department: 'Engineering',
          },
          gender: 'female',
          age: 25,
          hair: {
            color: 'Blond',
          },
          firstName: 'Jane',
          lastName: 'Smith',
          address: {
            postalCode: '67890',
          }
        },
        {
          company: {
            department: 'Support',
          },
          gender: 'female',
          age: 20,
          hair: {
            color: 'Brown',
          },
          firstName: 'Alice',
          lastName: 'Johnson',
          address: {
            postalCode: '54321',
          }
        },
        {
          company: {
            department: 'Support',
          },
          gender: 'female',
          age: 30,
          hair: {
            color: 'Brown',
          },
          firstName: 'Michael',
          lastName: 'Williams',
          address: {
            postalCode: '11110',
          }
        },
      ],
    };

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    const result = await getTransformedData(mockResponse.users);

    expect(result).toEqual({
      Engineering: {
        male: 1,
        female: 1,
        ageRange: '25-28',
        hair: {
          Black: 1,
          Blond: 1,
        },
        addressUser: {
          JohnDoe: '12345',
          JaneSmith: '67890',
        },
      },
      Support: {
        male: 0,
        female: 2,
        ageRange: '20-30',
        hair: {
          Brown: 2,
        },
        addressUser: {
          AliceJohnson: '54321',
          MichaelWilliams: '11110'
        },
      },
    });
  });
});

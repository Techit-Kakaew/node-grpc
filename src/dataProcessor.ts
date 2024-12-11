export interface User {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  company: { department: string; };
  hair: { color: string };
  address: { postalCode: string };
}

export interface DepartmentData {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

export const getTransformedData = async (users: User[]): Promise<Record<string, DepartmentData>> => {
  const departmentData: Record<string, DepartmentData> = {};

  for(let i = 0; i < users.length; i++) {
    const { gender, hair, address, firstName, lastName, company: { department } } = users[i];
    const fullName = `${firstName}${lastName}`;
    const postalCode = address.postalCode;

    if (!departmentData[department]) {
      departmentData[department] = {
        male: 0,
        female: 0,
        ageRange: '',
        hair: {},
        addressUser: {},
      };
    }

    departmentData[department][gender === 'male' ? 'male' : 'female']++;

    departmentData[department].hair[hair.color] = (departmentData[department].hair[hair.color] || 0) + 1;

    departmentData[department].addressUser[fullName] = postalCode;

    const ages = users.filter(({ company }) => company.department === department).map(({ age }) => age)
    departmentData[department].ageRange = `${Math.min(...ages)}-${Math.max(...ages)}`;
  }

  return departmentData;
};

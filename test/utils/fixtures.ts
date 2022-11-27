export const userFixture = {
  username: 'test',
  userId: '1',
  password: 'test',
};

export const contractFixture = {
  userId: userFixture.userId,
  contractName: 'test',
  templateId: '1',
  contractId: '1',
};

export const getMockedRequest = ({
  userId = '1',
  queryStringParameters = undefined,
  headers = {},
}: {
  userId?: string;
  queryStringParameters?: { id: string };
  headers?: { Authorization?: string };
}): RequestSlsPress => {
  return {
    event: {
      body: {
        contractName: contractFixture.contractName,
        templateId: contractFixture.templateId,
        username: userFixture.username,
        password: userFixture.password,
      },
      user: {
        userId,
        username: userFixture.username,
      },
      headers,
      queryStringParameters,
    },
  };
};

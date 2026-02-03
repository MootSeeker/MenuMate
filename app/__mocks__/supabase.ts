/**
 * Mock for Supabase Client
 * Used in tests to avoid actual API calls
 */

export const mockSupabaseUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: '2026-01-01T00:00:00.000Z',
};

export const mockSupabaseSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: mockSupabaseUser,
};

// Mock query builder for chaining
const createMockQueryBuilder = () => {
  const builder: Record<string, jest.Mock> = {};
  
  const chainableMethods = [
    'select',
    'insert',
    'update',
    'upsert',
    'delete',
    'eq',
    'neq',
    'gt',
    'gte',
    'lt',
    'lte',
    'like',
    'ilike',
    'is',
    'in',
    'contains',
    'containedBy',
    'order',
    'limit',
    'range',
    'single',
    'maybeSingle',
  ];

  chainableMethods.forEach((method) => {
    builder[method] = jest.fn().mockReturnValue(builder);
  });

  // Terminal methods that return data
  builder.then = jest.fn().mockResolvedValue({ data: [], error: null });
  
  return builder;
};

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    getUser: jest.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: mockSupabaseUser, session: mockSupabaseSession },
      error: null,
    }),
    signUp: jest.fn().mockResolvedValue({
      data: { user: mockSupabaseUser, session: mockSupabaseSession },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    updateUser: jest.fn().mockResolvedValue({
      data: { user: mockSupabaseUser },
      error: null,
    }),
  },
  from: jest.fn().mockImplementation(() => createMockQueryBuilder()),
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      download: jest.fn().mockResolvedValue({ data: new Blob(), error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      remove: jest.fn().mockResolvedValue({ data: [], error: null }),
      list: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
  functions: {
    invoke: jest.fn().mockResolvedValue({ data: {}, error: null }),
  },
};

// Mock createClient function
export const createClient = jest.fn().mockReturnValue(mockSupabaseClient);

// Reset all mocks helper
export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseClient.auth).forEach((mock) => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      (mock as jest.Mock).mockClear();
    }
  });
  mockSupabaseClient.from.mockClear();
};

export default mockSupabaseClient;

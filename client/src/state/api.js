import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const api = createApi({ 
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL}),
    reducerPath: 'adminApi',
    tagTypes: ['User', 'Products', 'Customers', 'Transactions', 'Sales', 'Dashboard'],
    endpoints: (builder) => ({ 
        getUser: builder.query({
            query: (id) => `general/user/${id}`,
            providesTags: ['User']
        }),
        getProducts: builder.query({
            query: () => 'client/products',
            providesTags: ['Products']
        }),
        getCustomers: builder.query({ 
            query: () => 'client/customers',
            providesTags: ['Customers']
        }),
        getTransactions: builder.query({
            query: ({ page, pageSize, sort, search}) => ({
                url: 'client/transactions',
                method: 'GET',
                param: {
                    page,
                    pageSize,
                    sort,
                    search
                }
            }),
            providesTags: ['Transactions']
        }),
        getSales: builder.query({
            query: () => 'sales/overallstat',
            providesTags: ['Sales']
        }),
        getDashboardStats: builder.query({
            query: () => 'general/dashboardStats',
            providesTags: ['Dashboard']
        }),
    })
})

export const {
    useGetUserQuery,
    useGetProductsQuery,
    useGetCustomersQuery,
    useGetTransactionsQuery,
    useGetSalesQuery,
    useGetDashboardStatsQuery
} = api;
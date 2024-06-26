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
            createCustomer: builder.mutation({
                query: (userData) => ({
                    url: `client/post/customer`,
                    method: 'POST',
                    body: userData
                }),
                invalidatesTags: ['User']
            }),
            deleteCustomer: builder.mutation({
                query: (id) => ({
                    url: `client/delete/customer/${id}`,
                    method: 'DELETE'
                }),
                invalidatesTags: ['User']
            }),
            getProducts: builder.query({
                query: () => 'client/products',
                providesTags: ['Products']
            }),
            getCustomers: builder.query({ 
                query: () => 'client/customers',
                providesTags: ['User']
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
            postTransaction: builder.mutation({
                query: (transactionData) => ({
                    url: 'client/post/transaction',
                    method: 'POST',
                    body: transactionData
                }),
                invalidatesTags: ['Transactions']
            }),
            deleteTransaction: builder.mutation({
                query: (id) => ({
                    url: `client/delete/transaction/${id}`,
                    method: 'DELETE'
                }),
                invalidatesTags: ['Transactions']
            }), 
            getSales: builder.query({
                query: () => 'sales/overallstat',
                providesTags: ['Sales']
            }),
            getDashboardStats: builder.query({
                query: () => 'general/dashboard',
                providesTags: ['Dashboard']
            }),
        })
    })

    export const {
        useGetUserQuery,
        useGetProductsQuery,
        useGetCustomersQuery,
        useGetTransactionsQuery,
        usePostTransactionMutation,
        useDeleteTransactionMutation,
        useGetSalesQuery,
        useGetDashboardStatsQuery,
        useCreateCustomerMutation,
        useDeleteCustomerMutation
    } = api;
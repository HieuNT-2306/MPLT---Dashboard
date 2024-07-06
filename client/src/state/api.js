    import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

    export const api = createApi({ 
        baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL}),
        reducerPath: 'adminApi',
        tagTypes: ['User', 'Products', 'Customers', 'Transactions', 'Sales', 'Dashboard', 'Categories', 'Scrap', 'Brands'],
        endpoints: (builder) => ({ 
            getUser: builder.query({
                query: (id) => `general/user/${id}`,
                providesTags: ['User']
            }),
            getCategories: builder.query({
                query: () => 'management/categories',
                providesTags: ['Categories']
            }),
            getBrands: builder.query({
                query: () => 'management/brands',
                providesTags: ['Brands']
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
            postProduct: builder.mutation({
                query: (productData) => ({
                    url: 'client/post/products',
                    method: 'POST',
                    body: productData
                }),
                invalidatesTags: ['Products']
            }),
            updateProduct: builder.mutation({
                query: (id, productData) => ({
                    url: `client/update/products/${id}`,
                    method: 'POST',
                    body: productData
                }),
                invalidatesTags: ['Products']
            }),
            deleteProduct: builder.mutation({
                query: (id) => ({
                    url: `client/delete/product/${id}`,
                    method: 'DELETE'
                }),
                invalidatesTags: ['Products']
            }),
            getSales: builder.query({
                query: () => 'sales/overallstat',
                providesTags: ['Sales']
            }),
            getDashboardStats: builder.query({
                query: () => 'general/dashboard',
                providesTags: ['Dashboard']
            }),
            scrapLazada: builder.mutation({
                query: (id, num) => ({
                    url: `scrap/lazada/id=${id}&num=10`,
                    method: 'POST'
                }),
                invalidatesTags: ['Scrap']
            }),
            scrapTiki: builder.mutation({
                query: (id, num) => ({
                    url: `scrap/tiki/id=${id}&num=10`,
                    method: 'POST'
                }),
                invalidatesTags: ['Scrap']
            }),
        })
    })

    export const {
        useGetUserQuery,
        useGetCategoriesQuery,
        useGetBrandsQuery,
        useGetProductsQuery,
        useGetCustomersQuery,
        useGetTransactionsQuery,
        usePostTransactionMutation,
        useDeleteTransactionMutation,
        useGetSalesQuery,
        useGetDashboardStatsQuery,
        useCreateCustomerMutation,
        usePostProductMutation,
        useUpdateProductMutation,
        useDeleteProductMutation,
        useDeleteCustomerMutation,
        useScrapLazadaMutation,
        useScrapTikiMutation
    } = api;
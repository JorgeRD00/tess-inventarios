import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@stores/user.store'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@presentation/views/auth/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { requiresAdmin: true },
    component: () => import('@presentation/views/dashboard/DashboardView.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'ProductList',
        component: () => import('@presentation/views/inventory/ProductListView.vue')
      },
      {
        path: 'new',
        name: 'ProductNew',
        component: () => import('@presentation/views/inventory/ProductFormView.vue')
      },
      {
        path: ':id/edit',
        name: 'ProductEdit',
        component: () => import('@presentation/views/inventory/ProductFormView.vue')
      },
      {
        path: 'movements',
        name: 'Movements',
        component: () => import('@presentation/views/inventory/MovementsView.vue')
      }
    ]
  },
  {
    path: '/purchases',
    name: 'Purchases',
    children: [
      {
        path: '',
        name: 'PurchaseList',
        component: () => import('@presentation/views/purchases/PurchaseListView.vue')
      },
      {
        path: 'new',
        name: 'PurchaseNew',
        component: () => import('@presentation/views/purchases/PurchaseFormView.vue')
      },
      {
        path: ':id/edit',
        name: 'PurchaseEdit',
        meta: { requiresAdmin: true },
        component: () => import('@presentation/views/purchases/PurchaseFormView.vue')
      }
    ]
  },
  {
    path: '/sales',
    name: 'Sales',
    children: [
      {
        path: '',
        name: 'SaleList',
        component: () => import('@presentation/views/sales/SaleListView.vue')
      },
      {
        path: 'new',
        name: 'SaleNew',
        component: () => import('@presentation/views/sales/SaleFormView.vue')
      },
      {
        path: ':id/edit',
        name: 'SaleEdit',
        meta: { requiresAdmin: true },
        component: () => import('@presentation/views/sales/SaleFormView.vue')
      }
    ]
  },
  {
    path: '/customers',
    name: 'Customers',
    children: [
      {
        path: '',
        name: 'CustomerList',
        component: () => import('@presentation/views/customers/CustomerListView.vue')
      },
      {
        path: 'new',
        name: 'CustomerNew',
        component: () => import('@presentation/views/customers/CustomerFormView.vue')
      },
      {
        path: ':id/edit',
        name: 'CustomerEdit',
        meta: { requiresAdmin: true },
        component: () => import('@presentation/views/customers/CustomerFormView.vue')
      }
    ]
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'SupplierList',
        component: () => import('@presentation/views/suppliers/SupplierListView.vue')
      },
      {
        path: 'new',
        name: 'SupplierNew',
        component: () => import('@presentation/views/suppliers/SupplierFormView.vue')
      },
      {
        path: ':id/edit',
        name: 'SupplierEdit',
        component: () => import('@presentation/views/suppliers/SupplierFormView.vue')
      }
    ]
  },
  {
    path: '/categories',
    name: 'Categories',
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'CategoryList',
        component: () => import('@presentation/views/categories/CategoryListView.vue')
      },
      {
        path: 'new',
        name: 'CategoryNew',
        component: () => import('@presentation/views/categories/CategoryFormView.vue')
      },
      {
        path: ':id/edit',
        name: 'CategoryEdit',
        component: () => import('@presentation/views/categories/CategoryFormView.vue')
      }
    ]
  },
  {
    path: '/brands',
    name: 'Brands',
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'BrandList',
        component: () => import('@presentation/views/brands/BrandListView.vue')
      },
      {
        path: 'new',
        name: 'BrandNew',
        component: () => import('@presentation/views/brands/BrandFormView.vue')
      },
      {
        path: ':id/edit',
        name: 'BrandEdit',
        component: () => import('@presentation/views/brands/BrandFormView.vue')
      }
    ]
  },
  {
    path: '/reports',
    name: 'Reports',
    meta: { requiresAdmin: true },
    component: () => import('@presentation/views/reports/ReportsView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { requiresAdmin: true },
    component: () => import('@presentation/views/settings/SettingsView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@presentation/views/profile/ProfileView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isAuthenticated || !!localStorage.getItem('auth_token')

  if (!to.meta.public && !isAuthenticated) {
    return next('/login')
  }

  if (to.meta.public && to.path === '/login' && isAuthenticated) {
    return next(userStore.isAdmin ? '/dashboard' : '/sales')
  }

  if (to.matched.some(r => r.meta.requiresAdmin) && !userStore.isAdmin) {
    return next('/sales')
  }

  next()
})

export default router

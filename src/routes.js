import Home from './components/HelloWorld.vue'
import Fornecedores from './components/Fornecedores.vue'
import Fornecedor from './components/AddFornecedor.vue'

export const routes = [ 
    {
        path: '', 
        components: {
            default: Home,
        },
        name: 'home'
    },
    {
        path: '/fornecedores',
        name: 'fornecedor',
        components:{
            default: Fornecedores,
        },
        children: [
            // {path: '/adicionar', component: AddFornecedor},
            // {path: ':id', component: UserDetail},
            // {path: ':id/edit', component: UserEdit, name: 'editUser'},
        ] 
    },
    {
        path: '/fornecedores/adicionar', 
        name: 'addfornecedor',
        component: Fornecedor,
    },
    {
        path: '/fornecedores/editar', 
        name: 'editfornecedor',
        component: Fornecedor,
    },
    {
        path: '*', redirect: { name: 'home'}
    }
]
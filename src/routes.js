import Home from './components/HelloWorld.vue'
import Fornecedores from './components/Fornecedores.vue'
import AddFornecedor from './components/AddFornecedor.vue'

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
        component: AddFornecedor,
    },
    {
        path: '*', redirect: { name: 'home'}
    }
]
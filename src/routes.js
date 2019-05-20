import Home from './components/HelloWorld.vue'
import Fornecedores from './components/fornecedor/Fornecedores.vue'
import Fornecedor from './components/fornecedor/AddFornecedor.vue'
import Clientes from './components/cliente/Clientes.vue'
import Cliente from './components/cliente/AddCliente.vue'
import Produtos from './components/produto/Produtos.vue'
import Produto from './components/produto/AddProduto.vue'
import ContasPagar from './components/contasPagar/ContasPagar.vue'
import Pagamento from './components/contasPagar/Pagamento.vue'
import ContasReceber from './components/contasReceber/ContasReceber.vue'
import Recebimento from './components/contasReceber/Recebimento.vue'

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
        path: '/clientes',
        name: 'cliente',
        component: Clientes,
    },
    {
        path: '/clientes/adicionar',
        name: 'addcliente',
        component: Cliente,
    },
    {
        path: '/clientes/editar', 
        name: 'editcliente',
        component: Cliente,
    },
    {
        path: '/produtos',
        name: 'produto',
        component: Produtos,
    },
    {
        path: '/produtos/adicionar',
        name: 'addproduto',
        component: Produto,
    },
    {
        path: '/produtos/editar', 
        name: 'editproduto',
        component: Produto,
    },
    {
        path: '/contasapagar',
        name: 'contaspay',
        component: ContasPagar,
    },
    {
        path: '/contasapagar/adicionar',
        name: 'addpagamento',
        component: Pagamento,
    },
    {
        path: '/contasapagar/editar',
        name: 'editpagamento',
        component: Pagamento,
    },
    {
        path: '/contasreceber',
        name: 'contasrcb',
        component: ContasReceber,
    },
    {
        path: '/contasreceber/adicionar',
        name: 'addreceita',
        component: Recebimento,
    },
    {
        path: '/contasreceber/editar',
        name: 'editreceita',
        component: Recebimento,
    },
    {
        path: '*', redirect: { name: 'home'}
    }
]
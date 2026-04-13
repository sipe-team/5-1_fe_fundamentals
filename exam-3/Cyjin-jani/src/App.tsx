import { Route, Switch } from 'wouter';
import { CartPage } from './pages/CartPage';
import { MenuDetailPage } from './pages/MenuDetailPage';
import { MenuPage } from './pages/MenuPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderCompletePage } from './pages/OrderCompletePage';
import { Layout } from './shared/components/Layout';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={MenuPage} />
        <Route path="/menu/:itemId" component={MenuDetailPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/orders/:orderId" component={OrderCompletePage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Layout>
  );
}

export default App;

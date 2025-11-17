import { View } from "@aws-amplify/ui-react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TabsView } from "./components/TabsView";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <View padding="medium" flex="1">
        <TabsView />
      </View>
      <Footer />
    </>
  );
}

export default App;

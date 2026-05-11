import { Redirect } from 'expo-router';

export default function StocksIndex() {
  return <Redirect href="/(tabs)/stocks/holdings" />;
}

import Content from "./content";
import useBasketData from "./queries";

export default function TrasferListPage() {
  const {data} = useBasketData({
    queries:{
      is_transfer:true
    }
  })
  // const { meUser } = useMeStore();
  return (
    <>
    {/* { meUser?.position?.role == 0 ? "": <TabBar/>} */}
      <Content data={data?.items || []}/>
    </>
  )
}

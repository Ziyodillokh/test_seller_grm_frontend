import Content from "./content";
import useBasketData from "./queries";

export default function BasketPage() {
  const {data} = useBasketData({
    queries:{
      is_transfer:false
    }
  })
  return (
    <>
        <Content data={data?.items || []}/>
    </>
  )
}

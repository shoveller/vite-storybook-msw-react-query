import './App.css'
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {FC} from "react";

type AppType = {
  page: number
}

const App: FC<Partial<AppType>> = () => {
  const [params] = useSearchParams()
  const page = params.get('page') || '0'
  const { data, isLoading } = useQuery({
    queryKey: ['poke', page],
    queryFn: () => fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=${page}}`).then(res => res.json()).then(data => data.results)
  })

  if (isLoading) {
      return <>로딩중</>
  }

  return (
    <>
      <p>페이지 번호: {page}</p>
      <p>레코드 갯수 :{data.length}</p>
    </>
  )
}

export default App

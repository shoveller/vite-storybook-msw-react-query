import './App.css'
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {FC} from "react";

type AppType = {
  page: number
}

type DataType = {
    name: string
}

const App: FC<Partial<AppType>> = () => {
  const [params, setParams] = useSearchParams()
  const page = params.get('page') || '0'
  const { data, isLoading } = useQuery({
    queryKey: ['poke', page],
    queryFn: () => fetch(`https://pokeapi.co/api/v2/pokemon?limit=5&offset=${page}}`).then(res => res.json()).then<DataType[]>(data => data.results)
  })

  if (isLoading) {
      return <>로딩중</>
  }

  return (
    <>
      <p>페이지 번호: {page}</p>
      <ul>
          {
              data?.map(item => {
                  return <li>{item.name}</li>
              })
          }
      </ul>
      <button onClick={() => setParams({ page: `${Number(page) - 1}` })}>이전 페이지</button>
      <button onClick={() => setParams({ page: `${Number(page) + 1}` })}>다음 페이지</button>
    </>
  )
}

export default App

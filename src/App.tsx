import './App.css'
import {useParams, useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {FC} from "react";

type PageType = {
    page: number
}

type DataType = {
    name: string
}

const useTranslation = () => {
    const {lang} = useParams();

    return ({kor, eng}: { kor: string, eng: string }) => {
        if (lang === 'en') {
            return eng
        }

        return kor
    }
}

const App: FC<Partial<PageType>> = () => {
    const [params, setParams] = useSearchParams()

    const page = params.get('page') || '0'
    const {data, isLoading} = useQuery({
        queryKey: ['poke', page],
        queryFn: () => fetch(`https://pokeapi.co/api/v2/pokemon?limit=5&offset=${page}}`).then(res => res.json()).then<DataType[]>(data => data.results)
    })
    const t = useTranslation()

    if (isLoading) {
        return <>{t({
            kor: '로딩중',
            eng: 'loading'
        })}</>
    }

    return (
        <>
            <p>{t({
                kor: '페이지 번호',
                eng: 'page no'
            })}: {page}</p>
            <ul>
                {
                    data?.map(item => {
                        return <li>{item.name}</li>
                    })
                }
            </ul>
            <button onClick={() => setParams({page: `${Number(page) - 1}`})}>{t({
                kor: '이전 페이지',
                eng: 'prev page'
            })}</button>
            <button onClick={() => setParams({page: `${Number(page) + 1}`})}>{t({
                kor: '다음 페이지',
                eng: 'next page'
            })}</button>
        </>
    )
}

export default App

import Button from "@/src/components/shared/Button/Button";
import Link from "next/link";



export default function HomePage(): JSX.Element { 

    return (
        <>
            <div style={{width: '100%', height: '100%', display: 'flex', 'flexDirection': 'column', 'alignItems': "center", 'justifyContent': 'center', gap: '20px', padding: '10px'}}>
                <div style={{'fontSize': '35px', 'fontWeight': '600'}}>404</div>
                <div style={{ 'textAlign': 'center'}}>Упс! Такой страницы не существует.</div>
                <Button ><Link href={'/'}>Вернуться на главную</Link></Button>
            </div>
        </>
    )
}
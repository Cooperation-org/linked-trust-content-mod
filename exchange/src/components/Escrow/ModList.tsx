export const ModList = (props:any) => {
    const updateDetail = (detail:Object) => {
        props.updateModDetail(detail)
        props.updatePage("viewMod")
    }

    return (
        <div>
            <br/>
            <h3>Mod List</h3><br/>
            <table>
            <tr>
                <th>Id</th>
                <th>Status</th>
                <th>Text Content</th>
                <th>Review Status</th>
                <th>Created On</th>
                <th></th>
            </tr>
            {
                props.mods.map((mod:any, index:any)=>(
                    <tr data-index={index}>
                        <td>{mod.id}</td>
                        <td>PENDING</td>  
                        <td>{mod.textContent}</td>  
                        <td>{mod.reviewStatus}</td>
                        <td>{new Date().toDateString()}</td> 
                        <td><button onClick={()=>updateDetail(mod)}>View Details</button></td>
                    </tr> 
                ))
            }
            </table>
            <br/>
            <button onClick={() => props.updatePage('escrowDetails')}>Back</button>
        </div>
    )
}
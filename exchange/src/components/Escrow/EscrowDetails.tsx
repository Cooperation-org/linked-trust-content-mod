import { useState } from "react"

export const EscrowDetails = (props:any) => {
    return (
        <div>
            <br/>
            <h3>Escrow Details</h3><br/>
            Title = {props.escrowDetail.title}<br/>
            Description = {props.escrowDetail.description}<br/>
            Funded = {props.escrowDetail.funded ? "True" : "False"}<br/>
            Address = {props.escrowDetail.escrow_address}<br/><br/>

            <button onClick={() => props.fetchModList(props.escrowDetail.id)}>View Milestone</button>
        </div>
    )
}
export const dbNewContractorSchemaFactory = (data: any) => {
    return {
        company_id: null,
        isActive: data.is_active,
        name: data.name,
        version: "1.0.0",
        schema: data.schema,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
    }
}

export const dbUpdateContractorSchemaFactory = (id: number, data: any) => {
    return {
        
    }
}
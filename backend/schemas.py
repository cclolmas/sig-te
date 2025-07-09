from marshmallow import Schema, fields, validate, ValidationError

class SchoolSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    inep_code = fields.String(required=True, validate=validate.Length(equal=8))
    contract_type = fields.String(required=True, validate=validate.OneOf([
        'CONTRATO_03', 'CONTRATO_04', 'INDENIZATORIO'
    ]))
    address = fields.String(required=False, allow_none=True)

school_schema = SchoolSchema()

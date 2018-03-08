
const policies = {
  attributes:{
    user:{
      /* Subjektityypin mahdolliset attribuutit */
      readAttribute: "Can read data",
      removeAttribute: "Can delete data",
      createAttribute: "Can create data",
      updateAttribute: "Can update data"
    }
  },
  rules:{
    /* Säännön nimi */
    "can-read":{
      /* Sääntöön tarvittavat attribuutit */
      attributes:{
        "user.readAttribute":{
          /* Odotettu arvo */
          comparison_type: "boolean",
          comparison: "boolAnd",
          value: true
        }
      }
    },
    "can-remove":{
      /* Attributes that are needed for rule */
      attributes:{
        "user.removeAttribute":{
          /* Expected compare value of a  */
          comparison_type: "boolean",
          comparison: "boolAnd",
          value: true
        }
      }
    },
    "can-create":{
      /* Attributes that are needed for rule */
      attributes:{
        "user.createAttribute":{
          /* Expected compare value of a  */
          comparison_type: "boolean",
          comparison: "boolAnd",
          value: true
        }
      }
    },
    "can-update":{
      /* Attributes that are needed for rule */
      attributes:{
        "user.updateAttribute":{
          /* Expected compare value of a  */
          comparison_type: "boolean",
          comparison: "boolAnd",
          value: true
        }
      }
    },
  }
}

module.exports.policies = policies;

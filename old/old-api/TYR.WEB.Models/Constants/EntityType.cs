using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.Constants
{
    public static class EntityType
    {
        /********** For PCO **************************/
        public const string Person = "Person";
        public const string Company_Organisation = "CorO";

        ///*************For Attachments Table's Entity********************/
        //public const string ANIMAL = "Animal";
        //public const string PCO = "PCO";
        //public const string TENANT = "Tenant";

        ///*********** For Attachment Type in Attachments Table **************/
        //public const string PHOTO = "Photo";
        //public const string DOCUMENT = "Document";
        //public const string VIDEO = "Video";
    }

    public static class AttachmentEntity
    {
        /*************For Attachments Table's Entity********************/
        public const string ANIMAL = "Animal";
        public const string PCO = "PCO";
        public const string TENANT = "Tenant";
    }

    public static class AttachmentType
    {
        /*********** For Attachment Type in Attachments Table **************/
        public const string PHOTO = "Photo";
        public const string DOCUMENT = "Document";
        public const string VIDEO = "Video";
    }

    public static class NameSuffix
    {
        public const string ANIMAL = "A";
        public const string PCO = "P";
        public const string TENANT = "R";
    }

}

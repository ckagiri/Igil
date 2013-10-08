using System;
using System.ComponentModel.DataAnnotations;

namespace Ligi.Core.Model
{
    public class Team
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Name is required!")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Code is required!")]
        [StringLength(4, MinimumLength = 3)]
        public string Code { get; set; }
        [Required(ErrorMessage = "Home-ground is required!")]
        public string HomeGround { get; set; }
        public string Tags { get; set; }
    }
}

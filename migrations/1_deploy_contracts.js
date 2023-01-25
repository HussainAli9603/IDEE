// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const idee = artifacts.require("idee");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
  deployer.deploy(idee);
};

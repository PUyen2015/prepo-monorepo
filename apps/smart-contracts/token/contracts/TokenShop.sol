// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/ITokenShop.sol";
import "./interfaces/IPurchaseHook.sol";

contract TokenShop is ITokenShop, Ownable, ReentrancyGuard {
  IERC20 private _paymentToken;
  // TODO: Separate pausing logic to a separate Pausable.sol
  bool private _paused;
  IPurchaseHook private _purchaseHook;
  mapping(address => mapping(uint256 => uint256)) private _contractToIdToPrice;

  //TODO: move it into Pausable.sol
  modifier whenNotPaused() {
    require(!_paused, "Token Shop: paused");
    _;
  }

  constructor(address _owner, address _newPaymentToken) {
    //TODO: switch to nominate + accept version using `safeOwnable`
    transferOwnership(_owner);
    _paymentToken = IERC20(_newPaymentToken);
  }

  function setContractToIdToPrice(
    address[] memory _tokenContracts,
    uint256[] memory _ids,
    uint256[] memory _prices
  ) external override onlyOwner {
    require(
      _tokenContracts.length == _prices.length && _ids.length == _prices.length,
      "Array length mismatch"
    );
    for (uint256 i; i < _tokenContracts.length; ++i) {
      _contractToIdToPrice[_tokenContracts[i]][_ids[i]] = _prices[i];
    }
  }

  function setPaused(bool _newPaused) external override onlyOwner {
    _paused = _newPaused;
  }

  function setPurchaseHook(address _newPurchaseHook) external override onlyOwner {
    _purchaseHook = IPurchaseHook(_newPurchaseHook);
  }

  function purchase(
    address[] memory _tokenContracts,
    uint256[] memory _ids,
    uint256[] memory _amounts
  ) external override nonReentrant whenNotPaused {
    require(
      _tokenContracts.length == _amounts.length && _ids.length == _amounts.length,
      "Array length mismatch"
    );
    require(address(_purchaseHook) != address(0), "Purchase hook not set");
    for (uint256 i; i < _tokenContracts.length; ++i) {
      bool _isERC1155 = IERC1155(_tokenContracts[i]).supportsInterface(type(IERC1155).interfaceId);
      if (_isERC1155) {
        _purchaseHook.hookERC1155(tx.origin, _tokenContracts[i], _ids[i], _amounts[i]);
        IERC1155(_tokenContracts[i]).safeTransferFrom(
          address(this),
          _msgSender(),
          _ids[i],
          _amounts[i],
          ""
        );
      } else {
        _purchaseHook.hookERC721(tx.origin, _tokenContracts[i], _ids[i]);
        IERC721(_tokenContracts[i]).safeTransferFrom(address(this), _msgSender(), _ids[i]);
      }
    }
  }

  function getPrice(address _tokenContract, uint256 _id) external view override returns (uint256) {
    return _contractToIdToPrice[_tokenContract][_id];
  }

  function isPaused() external view override returns (bool) {
    return _paused;
  }

  function getPaymentToken() external view override returns (address) {
    return address(_paymentToken);
  }

  function getPurchaseHook() external view override returns (IPurchaseHook) {
    return _purchaseHook;
  }

  function onERC1155Received(
    address,
    address,
    uint256,
    uint256,
    bytes memory
  ) external pure returns (bytes4) {
    return this.onERC1155Received.selector;
  }

  function onERC1155BatchReceived(
    address,
    address,
    uint256[] memory,
    uint256[] memory,
    bytes memory
  ) external pure returns (bytes4) {
    return this.onERC1155BatchReceived.selector;
  }

  function onERC721Received(
    address,
    address,
    uint256,
    bytes memory
  ) external pure returns (bytes4) {
    return this.onERC721Received.selector;
  }
}